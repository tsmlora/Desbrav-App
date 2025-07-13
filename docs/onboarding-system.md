# Sistema de Onboarding - Desbrav App

## Visão Geral

O sistema de onboarding do Desbrav foi projetado para oferecer uma experiência luxuosa e envolvente para novos usuários, apresentando todas as funcionalidades do app de forma elegante e intuitiva.

## Fluxo do Usuário

### 1. Primeiro Acesso
- Usuário abre o app pela primeira vez
- É redirecionado para `/auth/login` ou `/auth/register`

### 2. Registro
- Usuário cria uma conta nova
- Após registro bem-sucedido, é redirecionado para login
- Campo `onboarding_completed` é definido como `false` no banco

### 3. Login
- Usuário faz login
- Sistema verifica se `onboarding_completed` é `false`
- Se for primeira vez, redireciona para `/onboarding`

### 4. Onboarding
- 5 slides interativos apresentando as funcionalidades:
  1. **Rotas**: Descobrir trilhas personalizadas
  2. **Locais de Descanso**: Pontos estratégicos para parar
  3. **Medalhas**: Sistema de conquistas e progresso
  4. **Comunidade**: Conectar com outros aventureiros
  5. **Mensagens**: Sistema de comunicação

### 5. Conclusão
- Usuário completa o onboarding
- `onboarding_completed` é marcado como `true`
- Redireciona para a tela principal `/(tabs)`
- Exibe mensagem de boas-vindas personalizada

## Componentes Principais

### `app/onboarding.tsx`
- Tela principal do onboarding
- Navegação por slides com animações suaves
- Ilustrações de alta qualidade do Unsplash
- Ícones personalizados para cada funcionalidade

### `components/OnboardingIllustration.tsx`
- Componente visual para os ícones dos slides
- Gradiente sutil com sombras elegantes
- Design consistente com a identidade visual

### `components/WelcomeMessage.tsx`
- Modal de boas-vindas após completar onboarding
- Aparece apenas uma vez na primeira entrada
- Design luxuoso com gradiente da marca

### `components/PageTransition.tsx`
- Animações suaves entre telas
- Fade-in e slide-up para melhor UX
- Aplicado em todas as telas de auth e onboarding

## Cores e Design

### Paleta Principal
- **Primary**: `#F47B20` (Laranja da logo Desbrav)
- **Primary Light**: `#FF8A3D`
- **Background**: `#FAFAFA` (Claro e limpo)
- **Text**: `#1A1A1A` (Alto contraste)

### Inspirações de Design
- **iOS**: Navegação intuitiva e animações fluidas
- **Instagram**: Uso de imagens de alta qualidade
- **Airbnb**: Layout limpo e hierarquia visual clara
- **Notion**: Tipografia elegante e espaçamento
- **Linear**: Gradientes sutis e componentes modernos

## Funcionalidades Técnicas

### Estado Global (Zustand)
```typescript
interface AuthState {
  isFirstTime: boolean
  setFirstTimeComplete: () => void
}
```

### Banco de Dados (Supabase)
```sql
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
```

### Roteamento Inteligente
- `app/index.tsx` gerencia redirecionamentos baseado no estado
- Verifica autenticação e status do onboarding
- Redireciona automaticamente para a tela correta

## Melhorias Futuras

1. **Analytics**: Rastrear onde usuários abandonam o onboarding
2. **A/B Testing**: Testar diferentes versões dos slides
3. **Personalização**: Adaptar conteúdo baseado no perfil do usuário
4. **Gamificação**: Adicionar elementos de jogo no onboarding
5. **Feedback**: Coletar avaliações sobre a experiência

## Manutenção

### Atualizando Slides
Para adicionar ou modificar slides, edite o array `slides` em `app/onboarding.tsx`:

```typescript
const slides: OnboardingSlide[] = [
  {
    id: 6,
    title: 'Nova Funcionalidade',
    description: 'Descrição da nova feature...',
    icon: <NewIcon size={60} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/...'
  }
]
```

### Alterando Cores
Todas as cores estão centralizadas em `constants/colors.ts` para fácil manutenção.

### Testando Onboarding
Para testar novamente o onboarding:
1. Limpe o AsyncStorage do app
2. Ou execute: `UPDATE users SET onboarding_completed = FALSE WHERE id = 'user_id'`