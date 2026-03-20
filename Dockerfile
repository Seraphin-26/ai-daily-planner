# ─────────────────────────────────────────────────────────────────────────────
# AI Daily Planner — Dockerfile multi-stage
#
# 3 stages :
#   1. deps     → installe les dépendances npm
#   2. builder  → compile le build Next.js
#   3. runner   → image finale légère (~200MB) avec uniquement le nécessaire
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1 : Dépendances ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps

# alpine = image Linux ultra-légère (~5MB vs ~900MB pour ubuntu)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier uniquement les fichiers de dépendances (optimise le cache Docker)
# Si package.json ne change pas → Docker réutilise le cache de cette étape
COPY package.json package-lock.json ./

RUN npm ci --only=production && \
    # Installer aussi les devDependencies séparément pour le build
    npm ci


# ── Stage 2 : Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Récupérer les node_modules du stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copier tout le code source
COPY . .

# Variable d'environnement nécessaire pour le build
# (valeur factice — la vraie clé sera injectée au runtime)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compiler l'application
# Génère .next/standalone grâce à output: "standalone" dans next.config.mjs
RUN npm run build


# ── Stage 3 : Image finale (runner) ───────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
# Ne jamais faire tourner une app en production avec l'utilisateur root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier les fichiers statiques publics
COPY --from=builder /app/public ./public

# Copier le build standalone (contient Node.js + app sans node_modules inutiles)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Passer à l'utilisateur non-root
USER nextjs

# Port exposé par Next.js
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]
