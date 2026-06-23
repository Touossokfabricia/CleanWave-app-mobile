require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFunction() {
  const result = await prisma.$queryRaw`
    SELECT pg_get_functiondef(p.oid) as definition
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'handle_new_user'
  `;
  console.log('=== Définition de handle_new_user() ===');
  result.forEach(r => console.log(r.definition));
}

checkFunction()
  .catch(e => console.error('Erreur:', e.message))
  .finally(() => prisma.$disconnect());
