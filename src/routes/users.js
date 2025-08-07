const express = require('express');
const router = express.Router();
const { 
  getProfileFromUserName,
  getProfileFromAccountId,
  getProfileShareableLink,
  getUserFriendsAccountIds,
  getBasicPresence,
  getRecentlyPlayedGames,
  getUserPlayedGames,
  getUserRegion,
  getAccountDevices,
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens
} = require('psn-api');

// Profil utilisateur par nom d'utilisateur getProfileFromUserName
router.post('/users/profile/username/', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body
    const { username, npsso } = req.body;

    // Validation des paramètres requis
    if (!username || !npsso) {
      return res.status(400).json({
        error: "Le nom d'utilisateur et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération du profil utilisateur
    const profile = await getProfileFromUserName(authorization, username);

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès.",
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération du profil utilisateur",
      details: error.message
    });
  }
});
  
// Profil utilisateur par ID de compte getProfileFromAccountId
router.post('/users/profile/account/', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération du profil utilisateur par ID de compte
    const profile = await getProfileFromAccountId(authorization, accountId);

    res.status(200).json({
      message: "Profil utilisateur par ID de compte récupéré avec succès.",
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil par ID:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération du profil utilisateur",
      details: error.message
    });
  }
});

// Lien partageable du profil getProfileShareableLink
router.post('/users/shareable-link', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Génération du lien partageable
    const shareableLink = await getProfileShareableLink(authorization, accountId);

    res.status(200).json({
      message: "Lien partageable généré avec succès.",
      data: shareableLink
    });
  } catch (error) {
    console.error('Erreur lors de la génération du lien partageable:', error);
    res.status(500).json({
      error: "Erreur lors de la génération du lien partageable",
      details: error.message
    });
  }
});

// Amis d'un utilisateur getUserFriendsAccountIds
router.post('/users/friends', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des amis
    const friends = await getUserFriendsAccountIds(authorization, accountId);

    res.status(200).json({
      message: "Liste des amis récupérée avec succès.",
      data: friends
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des amis",
      details: error.message
    });
  }
});
  
// Présence basique d'un utilisateur getBasicPresence
router.post('/users/presence', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération de la présence
    const presence = await getBasicPresence(authorization, accountId);

    res.status(200).json({
      message: "Présence basique récupérée avec succès.",
      data: presence
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la présence:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération de la présence",
      details: error.message
    });
  }
});

// Jeux récemment joués getRecentlyPlayedGames
router.post('/users/recently-played', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Validation des options si fournies
    if (options) {
      if (options.limit && (typeof options.limit !== 'number' || options.limit <= 0)) {
        return res.status(400).json({
          error: "La limite doit être un nombre positif"
        });
      }
      
      if (options.categories && Array.isArray(options.categories)) {
        const validCategories = ['ps4_game', 'ps5_native_game'];
        const invalidCategories = options.categories.filter(cat => !validCategories.includes(cat));
        if (invalidCategories.length > 0) {
          return res.status(400).json({
            error: `Catégories invalides: ${invalidCategories.join(', ')}. Catégories valides: ${validCategories.join(', ')}`
          });
        }
      }
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des jeux récemment joués avec les options
    const recentlyPlayedGames = await getRecentlyPlayedGames(authorization, options || {});

    res.status(200).json({
      message: "Jeux récemment joués récupérés avec succès.",
      data: recentlyPlayedGames
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux récents:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des jeux récemment joués",
      details: error.message
    });
  }
});
  
// Jeux joués par un utilisateur getUserPlayedGames
router.post('/users/played-games', async (req, res) => {
  try {
    // Les paramètres et options sont récupérés depuis req.body
    const { accountId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des jeux joués
    const playedGames = await getUserPlayedGames(authorization, accountId, options);

    res.status(200).json({
      message: "Jeux joués récupérés avec succès.",
      data: playedGames
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux joués:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des jeux joués",
      details: error.message
    });
  }
});


router.post('/users/region/', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body
    const { npsso, username, locales } = req.body;

    // Validation des paramètres requis
    if (!npsso || !username) {
      return res.status(400).json({
        error: "Le token NPSSO et le nom d'utilisateur sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération de la région pour l'utilisateur spécifié
    const region = await getUserRegion(
      authorization,
      username,
      locales ? locales : ['en']
    );

    res.status(200).json({
      message: "Région utilisateur récupérée avec succès.",
      data: region
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la région:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération de la région",
      details: error.message
    });
  }
});
  
  
// Appareils d'un compte getAccountDevices
router.post('/users/devices', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body
    const { npsso } = req.body;

    // Validation des paramètres requis
    if (!npsso) {
      return res.status(400).json({
        error: "Le token NPSSO est requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des appareils du compte via getAccountDevices
    // options peut contenir headerOverrides, etc.
    const devicesResponse = await getAccountDevices(authorization);

    res.status(200).json({
      message: "Appareils du compte récupérés avec succès.",
      data: devicesResponse
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des appareils du compte:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des appareils du compte",
      details: error.message
    });
  }
});

module.exports = router;
  
