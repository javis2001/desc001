import QRCode from 'qrcode';

const catalog = {bronze:{1:4970,2:6461,3:8201},prata:{1:7990,2:10387,3:13184},ouro:{1:9990,2:12987,3:16484}};
const freight = {gratis:0,jadlog:990,retirada:0,full:1990};
const upgrades = {nenhum:0,premium:1990,dobro:2590,iphone:7900};
const titles = {bronze:'Bronze',prata:'Prata',ouro:'Ouro'};
const extras = {premium:'Upgrade Premium',dobro:'Caixa em Dobro',iphone:'Um iPhone Garantido'};
const digits = v => String(v || '').replace(/\D/g,'');
const validCpf = input => {
 const cpf = digits(input);
 if(!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;
 for(let n=9;n<=10;n++) {let sum=0;for(let i=0;i<n;i++)sum+=Number(cpf[i])*(n+1-i);let check=sum*10%11;if(check===10)check=0;if(check!==Number(cpf[n]))return false;}
 return true;
};
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
 if(!process.env.SKALE_API_KEY)return res.status(503).json({error:'Chave SkalePayments não configurada no servidor'});
 try {
  const body = typeof req.body==='string'?JSON.parse(req.body):req.body || {};
  const {plan,qty,shipping,upgrade,customer,address} = body;
  if(!Object.hasOwn(catalog,plan)||![1,2,3].includes(qty)||!Object.hasOwn(freight,shipping)||!Object.hasOwn(upgrades,upgrade))return res.status(400).json({error:'Opções do pedido inválidas'});
  if(!customer || typeof customer.name!=='string'||customer.name.trim().length<3||typeof customer.email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)||!validCpf(customer.cpf)||digits(customer.phone).length<10||digits(customer.phone).length>13)return res.status(400).json({error:'Dados pessoais inválidos'});
  if(!address || digits(address.cep).length!==8 || !String(address.street||'').trim() || !String(address.number||'').trim() || !String(address.city||'').trim() || !String(address.state||'').trim())return res.status(400).json({error:'Endereço inválido'});
  const base = catalog[plan][qty], delivery = freight[shipping], extra = upgrades[upgrade];
  const amount = base+delivery+extra;
  const orderId = 'DP-'+crypto.randomUUID();
  const items = [{title:`${qty}x Caixa Surpresa ${titles[plan]}`,unitPrice:base,quantity:1,tangible:true,externalRef:`caixa-${plan}-${qty}`}];
  if(delivery)items.push({title:`Frete ${shipping}`,unitPrice:delivery,quantity:1,tangible:false,externalRef:`frete-${shipping}`});
  if(extra)items.push({title:extras[upgrade],unitPrice:extra,quantity:1,tangible:false,externalRef:`upgrade-${upgrade}`});
  const payload = {amount,paymentMethod:'pix',pix:{expiresInDays:1},customer:{name:customer.name.trim(),email:customer.email.trim(),phone:digits(customer.phone),document:{number:digits(customer.cpf),type:'cpf'}},items,metadata:{pedido:orderId,plano:plan,quantidade:String(qty)}};
  // Não configuramos postbackUrl até confirmar autenticação e persistência do webhook.
  const upstream = await fetch('https://api.skalepayments.com.br/transactions',{method:'POST',headers:{'Content-Type':'application/json','X-API-Key':process.env.SKALE_API_KEY},body:JSON.stringify(payload),signal:AbortSignal.timeout(18000)});
  const data = await upstream.json().catch(()=>({}));
  if(!upstream.ok || !data.success || !data.id || !data.pix?.qrcode)return res.status(502).json({error:'Gateway não gerou o Pix. Verifique logs do servidor.',gatewayStatus:upstream.status});
  let qrcodeImage = data.pix.qrcodeImage || null;
  if(!qrcodeImage)qrcodeImage = await QRCode.toDataURL(data.pix.qrcode,{width:300,margin:2});
  return res.status(201).json({success:true,id:data.id,status:data.status,amount,orderId,pix:{qrcode:data.pix.qrcode,qrcodeImage}});
 } catch(err) {console.error('create-pix:',err?.message);return res.status(500).json({error:'Não foi possível criar a cobrança. Tente novamente.'});}
}
