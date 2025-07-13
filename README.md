# Desbrav - App de Motociclistas

## 🏍️ Sobre o Projeto

Desbrav é um aplicativo mobile desenvolvido em React Native para conectar motociclistas, compartilhar rotas, encontrar locais de descanso e participar de eventos da comunidade motociclística.

## ✨ Funcionalidades

- **Autenticação**: Sistema completo de login e registro com Supabase
- **Mapa de Rotas**: Explore rotas recomendadas para motociclistas
- **Sistema de Medalhas**: Conquiste medalhas ao completar rotas
- **Comunidades**: Participe de grupos de motociclistas
- **Eventos**: Descubra e participe de encontros
- **Locais de Descanso**: Encontre pousadas, hotéis e restaurantes
- **Mensagens**: Chat direto entre usuários com armazenamento em nuvem
- **Perfil**: Gerencie seu perfil e histórico

## 🛠 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem de programação
- **Supabase** - Backend as a Service (autenticação, banco de dados, real-time)
- **Zustand** - Gerenciamento de estado
- **Expo Router** - Navegação
- **Lucide React Native** - Ícones
- **Linear Gradient** - Gradientes

## 🚀 Como executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o Supabase (veja seção abaixo)
4. Execute o projeto: `npm start`
5. Use o Expo Go para testar no dispositivo

## 🗄️ Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL do arquivo `supabase-setup-complete.sql` no SQL Editor do Supabase
3. Execute o SQL do arquivo `supabase-populate-sample-data.sql` para adicionar dados de exemplo
3. Configure as variáveis de ambiente no arquivo `lib/supabase.ts`

### Estrutura do Banco de Dados

- **users**: Perfis dos usuários
- **messages**: Mensagens entre usuários
- **communities**: Comunidades de motociclistas
- **events**: Eventos e encontros

## 📱 Estrutura do App

```
app/
├── auth/                # Autenticação
│   ├── login.tsx        # Tela de login
│   └── register.tsx     # Tela de registro
├── (tabs)/              # Telas principais
│   ├── index.tsx        # Mapa/Home
│   ├── medals.tsx       # Medalhas
│   ├── community.tsx    # Comunidades
│   ├── messages.tsx     # Mensagens
│   ├── rest-places.tsx  # Locais de descanso
│   └── profile.tsx      # Perfil
├── routes/[id].tsx      # Detalhes da rota
├── events/[id].tsx      # Detalhes do evento
├── chat/[id].tsx        # Chat individual
└── create-*.tsx         # Telas de criação
```

## 🎨 Design

O app utiliza um design moderno e limpo com:
- Tema escuro como padrão
- Cores laranja (#F47B20) como primária
- Interface inspirada em apps como Instagram e Airbnb
- Componentes reutilizáveis e bem estruturados

## 📊 Estado da Aplicação

O app agora possui:
- ✅ Autenticação completa com Supabase
- ✅ Armazenamento de usuários em nuvem
- ✅ Sistema de mensagens real-time
- ✅ Navegação completa entre telas
- ✅ Interface responsiva
- ✅ Componentes interativos
- ✅ Sistema de busca
- ✅ Chat funcional com persistência
- ✅ Criação de comunidades e eventos

## 🔄 Próximos Passos

- Integração com mapas reais
- Sistema de notificações push
- Upload de imagens
- Geolocalização real
- Sistema de medalhas dinâmico
- Integração com redes sociais

## 🔧 Troubleshooting

### Erro ao criar perfil
Se você receber erros ao criar perfil, verifique:
1. Se o SQL foi executado corretamente no Supabase
2. Se as políticas RLS estão ativas
3. Se as permissões estão configuradas
4. Verifique os logs no console para mais detalhes