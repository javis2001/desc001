# Correções do site

- Carrossel: setas, gesto horizontal e avanço automático (pausa ao interagir).
- Vídeo: controles nativos e botão de reprodução; arquivo `media/testimonial.mp4` preservado.
- Quantidades: `js/quantidades.js` configura opções 1, 2 e 3 para as três caixas e atualiza os valores na página.

## Atenção sobre o checkout

Os botões ainda apontam para `/checkout?plano=...`. O projeto original fornecido não contém uma implementação de checkout. Os valores exibidos no navegador não determinam o valor efetivamente cobrado. É necessário integrar os produtos/quantidades ao checkout real e validar os preços no servidor.

## Publicação

Extraia o ZIP completo na raiz do repositório conectado à Vercel. Se já tiver os recursos do ZIP anterior, use o pacote leve substituindo os arquivos nos mesmos caminhos.

Testes executados: verificação de existência do vídeo, codec H.264/AAC, integridade dos arquivos e sintaxe JS. Não foi executado teste completo em navegador nem compra real.
