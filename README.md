# Excellence Store Hub

Título: Desenvolvimento de E-commerce Completo para 'Excellence Store' com Foco em Segurança e Painel de Administração

Visão Geral do Projeto:

Crie uma aplicação web de comércio eletrônico (e-commerce) totalmente funcional e responsiva para a marca "Excellence Store", baseada na imagem de logo e detalhes fornecidos em [image_0.png]. O site deve ter uma interface limpa, focada no usuário, com um fundo branco puro e a barra de navegação superior na cor prata metálico/cinza degradê do logo. O projeto inclui uma área pública (loja) e uma área privada (painel de administração do proprietário).

Recursos e Design do Front-end (Loja):

 * Página Inicial (Home):

   * Barra de Navegação Superior: Cor prata metálico do logo, com o logo "Excellence Store" alinhado à esquerda. Links de navegação para 'Novidades', 'Masculino', 'Feminino', 'Acessórios'. Ícone de carrinho de compras no canto direito.

   * Seção de Herói: Um banner limpo e de alta qualidade (como visto em [image_1.png]) mostrando a "Nova Coleção de Camisetas Stam".

   * Vitrine de Produtos: Uma grade de produtos com fundo branco, mostrando imagens nítidas de t-shirts, preços e um botão "Adicionar ao Carrinho". Use o design de grade limpo mostrado na imagem gerada.

 * Página de Produto:

   * Uma página dedicada para cada produto com imagens ampliáveis, detalhes técnicos, seleção de tamanho, preço e botão "Comprar agora".

 * Carrinho e Checkout:

   * Um processo de checkout de página única simplificado e seguro.

Recursos do Painel de Administração (Back-end):

 * Dashboard de Métricas: Uma visualização consolidada e privada para o proprietário da loja (como visto em [image_1.png]), contendo:

   * Cartões de KPI: Vendas Totais (com gráfico de linha), Novos Pedidos (gráfico de pizza), Produtos Mais Vendidos e Visitantes do Site.

   * Tabela de Pedidos Recentes: Uma lista detalhada e pesquisável de todos os pedidos com colunas para ID, Cliente, Data, Total e Status.

 * Segurança Cibernética (Foco Principal):

   * Página de Configurações de Segurança: Uma seção dedicada para o proprietário monitorar e configurar a segurança.

   * Indicador de Status: Um medidor de "Protegido" visível.

   * Registro de Auditoria: Uma lista de atividades recentes, incluindo logins de administradores com data, hora e IP (ex: "Login de Administrador de IP X.X.X.X").

   * Requisitos Técnicos: Autenticação segura do proprietário, sanitização de entrada de dados para evitar injeção de SQL e XSS, e proteção contra ataques de força bruta.

Diretrizes de Design e Identidade:

 * Paleta de Cores: Fundo branco puro (#FFFFFF) para a loja. A barra de navegação superior deve ser cinza/prata metálico conforme a logo de [image_0.png]. O texto e os ícones principais devem ser cinza escuro ou preto.

 * Logo: Utilize o logo "Excellence Store" exatamente como aparece na imagem anexada, em um formato vetorial ou PNG de alta resolução.

 * Estilo: Minimalista, profissional e confiável

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://excellence-store-secure.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/97a838f7-8682-4ac1-a01d-698b6d90e9a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
