const express = require('express');
const router = express.Router();
const { 
  getTitleTrophies,
  getTitleTrophyGroups,
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens
} = require('psn-api');

// Trophées d'un titre getTitleTrophies
router.post('/trophies/title/', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { npCommunicationId, trophyGroupId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!npCommunicationId || !npsso) {
      return res.status(400).json({
        error: "L'ID de communication NP et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des trophées du titre
    const trophies = await getTitleTrophies(
      authorization, 
      npCommunicationId, 
      trophyGroupId || "all", 
      options || {}
    );

    res.status(200).json({
      message: "Trophées du titre récupérés avec succès.",
      data: trophies
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des trophées du titre:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des trophées du titre",
      details: error.message
    });
  }
});
  
// Groupes de trophées d'un titre getTitleTrophyGroups
router.post('/trophies/title/groups', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { npCommunicationId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!npCommunicationId || !npsso) {
      return res.status(400).json({
        error: "L'ID de communication NP et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des groupes de trophées du titre
    const trophyGroups = await getTitleTrophyGroups(
      authorization, 
      npCommunicationId, 
      options || {}
    );

    res.status(200).json({
      message: "Groupes de trophées du titre récupérés avec succès.",
      data: trophyGroups
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes de trophées:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des groupes de trophées",
      details: error.message
    });
  }
});

module.exports = router;