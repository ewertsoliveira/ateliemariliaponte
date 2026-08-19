# Artools & Ateliê Ecosystem

Bem-vindo ao repositório das páginas interativas da **Artools** e **Ateliê Marília Ponte**.
Este projeto foi completamente refatorado para garantir máxima escalabilidade e organização, seguindo rigorosos padrões de "production-ready deployments".

## 📁 Arquitetura do Projeto

A estrutura foi modularizada para evitar CSS e JavaScript "inline" (sujos no próprio corpo do texto), dividindo as responsabilidades de estilo, interações e conteúdo:

```text
├── assets/                  # Arquivos estáticos puros
│   ├── images/              # Imagens (.jpg, .webp, .png, logos)
│   ├── raw_files/           # Imagens e vídeos originais não processados
│   ├── vendors/             # Bibliotecas (Google Fonts, ícones, vendors locais)
│   ├── video_frames/        # Sequências de canvas para a landing da Caneta
│   └── video_frames_vestido/# Sequências de canvas para a landing do Vestido
├── css/                     # Estilos modularizados
│   ├── design-system.css    # Estilo base reutilizável da biblioteca de componentes
│   ├── main.css             # Estilo principal do fluxo de casamento
│   └── pen-landing.css      # Estilo da página comercial da Caneta Tecnológica
├── js/                      # Lógica GSAP e Canvas Modularizada
│   ├── design-system.js     # Lógica central dos componentes (menus, botões beam)
│   ├── index.js             # Lógica de timeline e canvas do fluxo de casamento
│   └── pen-landing.js       # Lógica do renderizador de quadros da Caneta
├── templates/               # Documentações e Sandboxes
│   ├── design-system.html   # Template limpo com a UI Library ativa
│   └── design_system.html   # Referência suja/original baseada em mock da internet
├── index.html               # Página Oficial da Jornada dos Vestidos (Ateliê)
└── index2.html              # Página Oficial da Precision Pen (Artools)
```

## 🛠️ Tecnologias Utilizadas

- **Vanilla HTML5:** Arquitetura semântica purista e limpa.
- **GSAP & ScrollTrigger:** Motor principal das animações sincronizadas por scroll (seção pinnada da Jornada e transições suaves).
- **Tailwind CSS (CDN):** Estilos utilitários ágeis perfeitamente integrados sob uma camada de configuração de design token robusta.
- **HTML Canvas Sequence Engine:** As experiências interativas avançadas usam o `<canvas>` lendo centenas de arquivos estáticos `.jpg` frame-a-frame criados para que o usuário esfregue o vídeo usando a rolagem do mouse.

## 🚀 Como Executar Localmente

### Usando o Servidor Node
Simplesmente inicie o seu provedor de hot-reload preferido:
```bash
npx serve .
# Ou 
npx live-server
```

### Visual Studio Code
Instale a extensão **Live Server** e clique em "Go Live" na barra inferior para exibir `index.html` ou `index2.html`.

---
*Manutenção realizada e arquitetada por IA (Advanced Agentic Web Design).*
