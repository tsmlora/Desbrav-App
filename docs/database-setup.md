# Configuração do Banco de Dados

## Instruções para configurar o banco completo no Supabase

### 1. Execute o script principal de configuração
Execute o arquivo `supabase-setup-complete.sql` no SQL Editor do Supabase para criar todas as tabelas necessárias.

### 2. Popule com dados de exemplo
Execute o arquivo `supabase-populate-sample-data.sql` para adicionar comunidades e eventos de exemplo com dados realistas.

### 3. Estrutura Completa do Banco

#### Tabelas Principais:
- `users` - Perfis de usuários (estende auth.users)
- `messages` - Sistema de mensagens entre usuários
- `communities` - Comunidades de motociclistas
- `community_members` - Membros das comunidades
- `events` - Eventos e encontros
- `event_participants` - Participantes dos eventos

#### Funcionalidades Automáticas:
- Contagem automática de membros nas comunidades
- Contagem automática de participantes nos eventos
- Criação automática de perfil de usuário no registro
- Timestamps automáticos de criação e atualização

### 3. Estrutura das Comunidades

As comunidades agora têm:
- **Contagem real de membros** baseada na tabela `community_members`
- **Regiões específicas** (Sul, Sudeste, Nordeste, Centro-Oeste, Nacional)
- **Dados realistas** com milhares de membros por comunidade
- **Sistema de roles** (admin, moderator, member)

### 4. Comunidades de Exemplo

Após executar os scripts, você terá:

1. **Motociclistas do Sul** - 1,247 membros
2. **Aventureiros de Duas Rodas** - 3,478 membros  
3. **Estradeiros de Minas** - 875 membros
4. **Motociclistas da Serra** - 1,632 membros
5. **Exploradores do Nordeste** - 945 membros
6. **Riders de São Paulo** - 2,156 membros
7. **Motoclube Rio de Janeiro** - 1,789 membros
8. **Pantaneiros de Moto** - 567 membros

### 5. Funcionalidades Implementadas

- ✅ **Listagem de comunidades** com contagem real de membros
- ✅ **Criação de novas comunidades** via tRPC
- ✅ **Sistema de participação** em comunidades
- ✅ **Interface atualizada** com design melhorado
- ✅ **Cache invalidation** para atualizações em tempo real

### 6. Correções Implementadas

- ✅ **Corrigido ícone duplicado** na aba mensagens (trocado Send por MessageCircle)
- ✅ **Grupos reais** substituindo dados mock
- ✅ **Contagem dinâmica** de participantes do Supabase
- ✅ **Sistema robusto** de comunidades com backend completo