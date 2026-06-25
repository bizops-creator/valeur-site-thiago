# Valeur Site — Landing Page "Diagnóstico 360º"

Site reconstruído a partir do material recuperado (HTML de download autocontido + arquivos soltos de CSS, JS e assets). Esta versão separa tudo na estrutura padrão de pastas, em vez do HTML único com tudo embutido em base64.

## Estrutura

```
valeur-site/
├── index.html
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── fonts/
    │   ├── accidental-presidency.ttf
    │   └── publica-play.otf
    ├── images/
    │   ├── logo/        (símbolos e wordmarks da marca)
    │   ├── hero/         (foto e ondas decorativas do topo)
    │   ├── clients/      (23 logos da vitrine de clientes)
    │   └── sections/     (fotos usadas nas seções: band, founders, final, como-bw)
    └── videos/           (vazia — nenhum vídeo foi recuperado)
```

## O que foi feito

- O HTML "Diagnóstico Valeur - Download.html" era uma exportação autocontida (estilos e imagens em base64 dentro do próprio arquivo). Cada imagem embutida foi comparada byte a byte com os arquivos do `assets.zip` e substituída pelo caminho real do arquivo correspondente — nenhuma imagem ficou em base64.
- Os componentes `<image-slot>` (ferramenta interna de edição de imagem, não funcional fora do ambiente onde a página foi criada) foram substituídos por `<img>` comuns:
  - Foto da faixa "FAIXA FOTO" → `assets/images/sections/band.jpg`
  - Foto da seção "Fundadores" → `assets/images/sections/founders.jpg`
  - Avatares dos 3 depoimentos → ainda não há fotos reais dos clientes nesse material; foi usado o símbolo da marca como placeholder circular (`assets/images/logo/symbol-green.png`). Recomendo substituir por fotos reais quando disponíveis.
- O CSS embutido no HTML e o `styles.css` enviado separadamente eram idênticos — mas nenhum dos dois tinha regras para `.photoband`, `.tcard`, `.tlist`, `.stars`, `.badge` (seção de depoimentos) nem para `.compare`/`.crow` (tabela comparativa). Essas regras foram recriadas usando os mesmos tokens de design (cores, fontes, espaçamentos) do restante do site, já que esse trecho aparentemente não foi salvo em nenhum dos arquivos recuperados.
- As fontes eram `accidental.ttf` e `publica-play.otf`. A primeira foi renomeada para `accidental-presidency.ttf` (nome real da fonte). A segunda **não pôde** ser renomeada para `fonte-02.woff2` como na estrutura original pedida, pois é um arquivo `.otf`, não `.woff2` — trocar a extensão sem reconverter o arquivo quebraria a fonte. Os caminhos no CSS (`@font-face`) já apontam para os nomes corretos.
- `lp.js` foi usado como `assets/js/main.js` (cuida do header fixo, animações de entrada, máscara de telefone/CNPJ, contador de estatísticas e envio do formulário para o webhook).
- `image-slot.js` **não foi incluído** no site final — era uma ferramenta de edição/posicionamento de imagem usada apenas durante a criação da página, sem função em produção.

## Pendências / pontos de atenção

1. **Fotos reais dos depoimentos** (t1, t2, t3) — hoje usam um placeholder genérico.
2. **Webhook do formulário** (`assets/js/main.js`, linha 6) está apontando para `https://webhook.navtus.com.br/...` — confirme se essa URL ainda é válida.
3. `wordmark-champ.png` e `waves-hero.png` foram recuperados e organizados em `assets/images/`, mas não são usados em nenhum lugar do `index.html` atual — ficam disponíveis caso queira usá-los em outra seção.
