// ============================================================
// prisma/seed.js — Données de démonstration CleanWave
//
// Compte administrateur de démo :
//   Email    : admin@cleanwave.cm
//   Mot de passe : Admin@CleanWave2026
//   Rôle     : admin (ADMINISTRATEUR)
//
// Exécution : npm run prisma:seed
// Prérequis : .env configuré avec SUPABASE_SERVICE_ROLE_KEY
// ============================================================

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@cleanwave.cm';
const ADMIN_PASSWORD = 'Admin@CleanWave2026';

async function main() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env');
        process.exit(1);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log('🌱 Seed CleanWave — démarrage...\n');

    // ── Localisations (quartiers) ──
    const quartiers = [
        { nom: 'Akwa', ville: 'Douala', description: 'Centre-ville Douala' },
        { nom: 'Bonanjo', ville: 'Douala', description: 'Quartier administratif' },
        { nom: 'Bastos', ville: 'Yaoundé', description: 'Quartier résidentiel' },
        { nom: 'Mokolo', ville: 'Yaoundé', description: 'Grand marché' },
    ];

    for (const q of quartiers) {
        await prisma.localisation.upsert({
            where: { nom: q.nom },
            update: {},
            create: q,
        });
    }
    console.log('✅ Localisations créées :', quartiers.map((q) => q.nom).join(', '));

    // ── Types de déchets ──
    const types = [
        { nom: 'Plastique', icone: 'bottle', couleur: '#3AB795' },
        { nom: 'Verre', icone: 'glass', couleur: '#2196F3' },
        { nom: 'Métal', icone: 'construct', couleur: '#FF9800' },
        { nom: 'Organiques', icone: 'leaf', couleur: '#4CAF50' },
        { nom: 'Électronique', icone: 'hardware-chip', couleur: '#9C27B0' },
    ];

    for (const t of types) {
        await prisma.typeDechet.upsert({
            where: { nom: t.nom },
            update: {},
            create: t,
        });
    }
    console.log('✅ Types de déchets créés');

    // ── Compte administrateur ──
    let adminId;

    const existingAdmin = await prisma.profile.findUnique({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
        adminId = existingAdmin.id;
        console.log('ℹ️  Admin existant trouvé dans Profile :', ADMIN_EMAIL);
    } else {
        // Vérifier si l'utilisateur existe déjà dans Supabase Auth
        const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = existingAuthUsers?.users?.find(u => u.email === ADMIN_EMAIL);

        if (existingAuthUser) {
            adminId = existingAuthUser.id;
            console.log('ℹ️  Utilisateur déjà présent dans Supabase Auth :', ADMIN_EMAIL);
        } else {
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                email_confirm: true,
            });

            if (authError) {
                console.error('Erreur complète Supabase :', authError);
                throw authError;
            }

            adminId = authData.user.id;
            console.log('✅ Utilisateur créé dans Supabase Auth');
        }

        await prisma.profile.create({
            data: {
                id: adminId,
                nom: 'Administrateur',
                prenom: 'CleanWave',
                email: ADMIN_EMAIL,
                type: 'admin',
                settings: { create: {} },
            },
        });
        console.log('✅ Compte administrateur créé');
    }


    // ── Point de dépôt de démo ──
    const akwa = await prisma.localisation.findUnique({ where: { nom: 'Akwa' } });
    if (akwa) {
        const depotExists = await prisma.depot.findFirst({ where: { nom: 'Dépôt Akwa Central' } });
        if (!depotExists) {
            await prisma.depot.create({
                data: {
                    nom: 'Dépôt Akwa Central',
                    latitude: 4.0511,
                    longitude: 9.7679,
                    localisation_id: akwa.id,
                    type_dechets: 'Plastique, Verre, Métal',
                    description: 'Point de dépôt principal Akwa',
                },
            });
            console.log('✅ Point de dépôt de démo créé (Akwa)');
        }
    }

    console.log('\n══════════════════════════════════════════');
    console.log('  COMPTE ADMINISTRATEUR DE DÉMONSTRATION');
    console.log('══════════════════════════════════════════');
    console.log('  Email      :', ADMIN_EMAIL);
    console.log('  Mot de passe :', ADMIN_PASSWORD);
    console.log('  Rôle       : admin (ADMINISTRATEUR)');
    console.log('══════════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Erreur seed :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
