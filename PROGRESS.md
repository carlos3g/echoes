# Echoes — Feature Implementation Progress

## Tier 1 — Críticas

- [x] **Busca** — Pesquisar quotes por texto e por autor (API + app com debounce)
- [x] **Tela de favoritos** — Tab dedicada com quotes favoritadas (API filter + nova tab)
- [x] **Copiar citação** — Botão copy no quote card (expo-clipboard + toast)
- [x] **Empty states** — Componente EmptyState reutilizável + aplicado em quote list e tag list
- [x] **Completar perfil** — Tela de edição de nome/username/email com validação

## Tier 2 — Alto valor

- [x] **Páginas de autores** — Nova tab, listagem com busca, detalhe com bio + quotes do autor
- [x] **Categorias** — Chips horizontais na tela de quotes, filtro por categoria (API + app)
- [ ] **Quote do dia** — Endpoint + tela com citação diária

## Melhorias técnicas

- [x] **Error boundary** — Crash graceful no root layout
- [x] **Token refresh automático** — Interceptor com queue de requests + retry automático
- [x] **Feedback háptico** — Vibração ao favoritar (expo-haptics)

## Dependências instaladas

- `expo-clipboard` — Copiar texto para clipboard
- `expo-haptics` — Feedback háptico

## Arquivos criados

### App
- `src/shared/components/error-boundary.tsx`
- `src/shared/components/ui/empty-state.tsx`
- `src/shared/hooks/use-debounce.ts`
- `src/features/quote/components/quote-card/copy-button.tsx`
- `src/features/quote/hooks/use-toggle-favorite-quote.ts`
- `src/features/author/contracts/author-service.contract.ts`
- `src/features/author/services/author-service.service.ts`
- `src/features/author/services/index.ts`
- `src/features/author/hooks/use-get-authors.ts`
- `src/features/author/hooks/use-get-author.ts`
- `src/features/category/contracts/category-service.contract.ts`
- `src/features/category/services/category-service.service.ts`
- `src/features/category/services/index.ts`
- `src/features/category/hooks/use-get-categories.ts`
- `src/features/auth/hooks/use-update-profile.ts`
- `src/app/(app)/(tabs)/favorites.tsx`
- `src/app/(app)/(tabs)/(authors)/_layout.tsx`
- `src/app/(app)/(tabs)/(authors)/index.tsx`
- `src/app/(app)/(tabs)/(authors)/[authorUuid].tsx`
- `src/app/(app)/(tabs)/(settings)/edit-profile.tsx`
- `src/lib/react-query/query-keys.ts`
