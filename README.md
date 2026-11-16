# Rota Brasil – Guia de turismo acessível

Projeto acadêmico de desenvolvimento web (HTML, CSS e JavaScript puros, sem frameworks) que simula um guia de turismo pelo Brasil. O foco é **acessibilidade (WCAG 2.2 AA)**, **usabilidade (heurísticas de Nielsen)** e **escolha consciente de paletas de cores**.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Estrutura de pastas](#2-estrutura-de-pastas)
3. [Como executar](#3-como-executar)
4. [Construção passo a passo](#4-construção-passo-a-passo)
5. [Paletas de cores e contraste](#5-paletas-de-cores-e-contraste)
6. [Checklist WCAG aplicado](#6-checklist-wcag-aplicado)
7. [Versionamento com GitHub](#7-versionamento-com-github)
8. [Limitações conhecidas](#8-limitações-conhecidas)

## 1. Visão geral

| Requisito do enunciado | Onde está no projeto |
|---|---|
| Cartões | Seção "Destinos em destaque" (`#destinos`) |
| Abas de pesquisa | Painel com abas Destinos / Passeios / Hospedagem no topo (`.search-box`) |
| Seção de contato com formulário | `#contato`, com validação em JavaScript |
| Carrossel | Seção "Galeria de paisagens" (`#galeria`) |
| Imagens | Pasta `img/` (ilustrações SVG com texto alternativo) |
| Cartões explicativos | Seção "Como planejar sua viagem" (`#dicas`) |
| Modo escuro/claro | Botão na barra de acessibilidade |
| Rodapé | `<footer class="site-footer">` |
| Página de login | `login.html` |
| Aba de acessibilidade | Barra no cabeçalho: tema, alto contraste, fonte A+/A−, reduzir animações, restaurar |

## 2. Estrutura de pastas

```
rota-brasil/
├── index.html        # página inicial
├── login.html        # página de login (simulada)
├── style.css         # estilos, tokens de cor e temas
├── script.js         # acessibilidade, abas, filtro, carrossel, formulários
├── README.md
└── img/
    ├── praia.svg
    ├── chapada.svg
    ├── amazonia.svg
    ├── cidade-historica.svg
    └── pantanal.svg
```

## 3. Construção passo a passo

### Passo 1 – Planejamento
Definição do tema (turismo no Brasil), público (viajantes de todas as idades e habilidades), objetivos (descobrir destinos, filtrar, entrar em contato) e lista de requisitos do enunciado. Escolha das paletas (seção 5).

### Passo 2 – Estrutura semântica em HTML
Em `index.html` foram usados elementos semânticos: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`. Cada seção possui um `h2` e a hierarquia de títulos não pula níveis. O `lang="pt-BR"` está declarado e há um link **"Pular para o conteúdo"** logo no início.

### Passo 3 – Tokens de design no CSS
Todas as cores ficam em variáveis CSS (`--bg`, `--text`, `--primary`, `--accent`…) no `:root`. Os temas escuro e de alto contraste apenas **redefinem** essas variáveis via atributos `data-theme` e `data-contrast` no `<html>`. Assim, nenhum componente precisa de código específico por tema.

### Passo 4 – Layout responsivo
Uso de CSS Grid (`repeat(auto-fill, minmax(260px, 1fr))`) para os cartões, Flexbox para cabeçalho e barras, `clamp()` para títulos fluidos e uma *media query* em 860 px que empilha o hero e o contato.

### Passo 5 – Barra de acessibilidade
Botões com `aria-pressed` alternam: modo claro/escuro, alto contraste, aumento/diminuição da fonte (80% a 150%, alterando o tamanho-base do `html`, então tudo que usa `rem` escala) e redução de animações. As escolhas são salvas em `localStorage`. Um pequeno script no `<head>` as aplica antes da primeira pintura, evitando "piscar" de tema. O sistema também respeita `prefers-color-scheme` e `prefers-reduced-motion`.

### Passo 6 – Abas de pesquisa
Implementadas com o padrão ARIA *Tabs*: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` e `aria-controls`. O teclado funciona com ← → Home End. Cada aba tem um formulário que filtra os cartões por `data-*` (nome, região, tipo de experiência, faixa de orçamento). O resultado é anunciado por uma região `aria-live` ("3 destinos encontrados.").

### Passo 7 – Cartões
Oito cartões `article` com imagem, etiqueta, título, texto e botão. Os atributos `data-nome`, `data-regiao`, `data-exp` e `data-orc` alimentam o filtro. A busca ignora acentos e maiúsculas (`normalize("NFD")`).

### Passo 8 – Carrossel acessível
Quatro slides com `figure`/`figcaption`, botões anterior/próximo, indicadores e botão **Pausar** (WCAG 2.2.2). A reprodução automática para ao passar o mouse, ao receber foco e quando o usuário prefere movimento reduzido. As setas do teclado também navegam.

### Passo 9 – Cartões explicativos
Três cartões numerados com dicas de planejamento (época, orçamento, viagem consciente), cada um com cor de borda distinta, mas sem depender só da cor para transmitir informação.

### Passo 10 – Formulário de contato
Campos com `<label>` visível, `autocomplete`, mensagens de erro associadas por `aria-describedby`, `aria-invalid` ao falhar e foco movido ao primeiro erro. A validação roda no `submit` com `novalidate`, para que as mensagens sejam em português e estilizadas. Há caixa de aceite (LGPD) e mensagem de sucesso em `role="status"`.

### Passo 11 – Página de login
`login.html` reutiliza os estilos, tem botão "Mostrar/Ocultar senha" e validação equivalente. **A autenticação é apenas simulada** no navegador; um sistema real exigiria servidor, HTTPS e armazenamento seguro de senhas.

### Passo 12 – Rodapé
Três colunas: sobre o projeto, navegação e nota de acessibilidade.

### Passo 13 – Testes e análise de contraste
Razões de contraste calculadas pela fórmula de luminância relativa da WCAG para todos os pares texto/fundo (seção 5). Na primeira análise, a borda dos campos de formulário não atingia 3:1 (1,75:1 no claro e 2,03:1 no escuro). Foi criada a variável `--border-ui` e o problema foi corrigido. Também foram verificados: navegação só por teclado, zoom de 200%, leitura de títulos e ordem de foco.

## 4. Paletas de cores e contraste

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#FFFFFF` | `#10161C` |
| Superfície | `#F3F7F8` | `#1A232C` |
| Texto | `#14213D` (15,97:1) | `#E8EEF2` (15,55:1) |
| Texto secundário | `#44546A` (7,71:1) | `#B4C2CD` (10,00:1) |
| Primária (azul-petróleo) | `#0A5C7A` (7,43:1) | `#5CC8E8` (9,43:1) |
| Destaque (laranja queimado) | `#B83C08` (5,69:1) | `#FFA45C` (8,11:1 sobre superfície) |
| Verde natureza | `#17704F` (5,62:1) | `#5FD3A0` (8,57:1) |
| Borda de componentes | `#5F7482` (4,88:1) | `#7C8D9B` (5,32:1) |
| Foco | `#7A2FD1` (6,66:1) | `#FFD84D` (13,16:1) |

Razão mínima exigida pela WCAG 2.2 nível AA: **4,5:1** para texto normal, **3:1** para texto grande e componentes de interface.

## 5. Checklist WCAG aplicado

- 1.1.1 Conteúdo não textual: todas as imagens têm `alt` descritivo.
- 1.3.1 Informação e relações: HTML semântico, `label` ligado a `input`.
- 1.4.1 Uso de cor: erros trazem texto, não apenas cor.
- 1.4.3 Contraste mínimo e 1.4.11 Contraste não textual: ver seção 5.
- 1.4.4 Redimensionar texto: fonte em `rem`, botões A+/A−, funciona a 200%.
- 2.1.1 Teclado: tudo operável por teclado.
- 2.2.2 Pausar, parar, ocultar: botão de pausa no carrossel.
- 2.3.3 Animação a partir de interações: opção "Reduzir animações".
- 2.4.1 Ignorar blocos: link "Pular para o conteúdo".
- 2.4.7 Foco visível: contorno de 3 px com cor própria por tema.
- 2.5.8 Tamanho do alvo: botões com no mínimo 44 × 44 px.
- 3.1.1 Idioma da página: `lang="pt-BR"`.
- 3.3.1 / 3.3.2 Identificação de erros e rótulos: mensagens específicas e rótulos visíveis.
- 4.1.2 Nome, função, valor: ARIA nas abas, no carrossel e nos botões alternáveis.

Esta lista é uma autoavaliação. Uma conformidade completa exige testes com leitores de tela (NVDA, VoiceOver) e com pessoas usuárias.

## 6. Versionamento com GitHub

```bash
git init
git add index.html && git commit -m "feat: estrutura semântica da página inicial"
git add style.css && git commit -m "feat: tokens de cor e tema claro/escuro"
git add script.js img && git commit -m "feat: abas, filtro, carrossel e acessibilidade"
git add login.html && git commit -m "feat: página de login"
git add README.md && git commit -m "docs: README e análise de contraste"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/rota-brasil.git
git push -u origin main
```

## 7. Limitações conhecidas

- As imagens são ilustrações SVG criadas para o projeto. em um site real seriam fotos com direitos de uso.
- Formulário de contato e login não enviam dados a nenhum servidor.
- Não foram feitos testes com leitores de tela reais.
