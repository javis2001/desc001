export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Método não permitido'});
 const id = String(req.query.id || '');
 if(!/^[a-zA-Z0-9_-]{5,120}$/.test(id))return res.status(400).json({error:'ID inválido'});
 if(!process.env.SKALE_API_KEY)return res.status(503).json({error:'Gateway não configurado'});
 try{
  const response = await fetch('https://api.skalepayments.com.br/transactions/'+encodeURIComponent(id),{headers:{'X-API-Key':process.env.SKALE_API_KEY},signal:AbortSignal.timeout(15000)});
  const data = await response.json().catch(()=>({}));
  if(!response.ok)return res.status(502).json({error:'Falha ao consultar pagamento'});
  const status = String(data.status || data.transaction?.status || '').toUpperCase();
  if(!['WAITING_PAYMENT','PAID','REFUSED','CANCELLED','REFUNDED'].includes(status))return res.status(502).json({error:'Status não reconhecido'});
  return res.status(200).json({id,status});
 }catch(err){console.error('status:',err?.message);return res.status(502).json({error:'Falha temporária na consulta'});}
}
