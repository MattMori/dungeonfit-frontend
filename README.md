# DungeonFit Frontend

Frontend em React + Vite pronto para integrar com o backend do DungeonFit.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

No `.env`, ajuste a URL do backend:

```env
VITE_API_URL=http://localhost:3000
```

## Páginas prontas

- Login
- Cadastro
- Dashboard
- Personagem
- Atividades
- Criar atividade
- Histórico
- Progresso
- Recompensas
- Ranking
- Perfil

## Rotas esperadas do backend

- `/auth`
- `/users`
- `/characters`
- `/activities`
- `/activity-logs`
- `/progress`
- `/rewards`
- `/dashboard`
- `/rankings`

Também há fallback para algumas rotas legadas: `/users/buscar`, `/users/atualizar` e `/rankings/listar`.
