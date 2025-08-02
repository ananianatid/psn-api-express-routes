const express = require('express');
const router = express.Router();
const { 
  getUserTrophyGroupEarningsForTitle,
  getUserTitles,
  getUserTrophiesEarnedForTitle,
  getUserTrophyProfileSummary,
  getUserTrophiesForSpecificTitle,
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens
} = require('psn-api');

// Gains de groupes de trophées pour un titre getUserTrophyGroupEarningsForTitle
router.post('/users/trophy-groups/', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { accountId, npCommunicationId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npCommunicationId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte, l'ID de communication NP et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des gains de groupes de trophées pour un titre
    const trophyGroupEarnings = await getUserTrophyGroupEarningsForTitle(
      authorization,
      accountId,
      npCommunicationId,
      options || {}
    );

    res.status(200).json({
      message: "Gains de groupes de trophées récupérés avec succès.",
      data: trophyGroupEarnings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des gains de groupes de trophées:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des gains de groupes de trophées",
      details: error.message
    });
  }
});

// Titres d'un utilisateur getUserTitles
router.post('/users/titles', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
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

    // Récupération des titres d'un utilisateur
    const userTitles = await getUserTitles(
      authorization,
      accountId,
      options || {}
    );

    res.status(200).json({
      message: "Titres utilisateur récupérés avec succès.",
      data: userTitles
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des titres utilisateur:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des titres utilisateur",
      details: error.message
    });
  }
});

// Trophées gagnés pour un titre getUserTrophiesEarnedForTitle
router.post('/users/trophies/earned', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { accountId, npCommunicationId, trophyGroupId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npCommunicationId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte, l'ID de communication NP et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des trophées gagnés pour un titre
    const earnedTrophies = await getUserTrophiesEarnedForTitle(
      authorization,
      accountId,
      npCommunicationId,
      trophyGroupId || "all",
      options || {}
    );

    res.status(200).json({
      message: "Trophées gagnés récupérés avec succès.",
      data: earnedTrophies
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des trophées gagnés:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des trophées gagnés",
      details: error.message
    });
  }
});
  
// Résumé du profil trophées getUserTrophyProfileSummary
router.post('/users/trophy-summary', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
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

    // Récupération du résumé du profil trophées
    const trophyProfileSummary = await getUserTrophyProfileSummary(
      authorization,
      accountId,
      options || {}
    );

    res.status(200).json({
      message: "Résumé du profil trophées récupéré avec succès.",
      data: trophyProfileSummary
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du résumé du profil trophées:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération du résumé du profil trophées",
      details: error.message
    });
  }
});
  
// Trophées pour des titres spécifiques getUserTrophiesForSpecificTitle
router.post('/users/trophies/specific-titles', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { accountId, options, npsso } = req.body;

    // Validation des paramètres requis
    if (!accountId || !npsso) {
      return res.status(400).json({
        error: "L'ID de compte et le token NPSSO sont requis"
      });
    }

    // Validation des options
    if (!options || !options.npTitleIds) {
      return res.status(400).json({
        error: "Les options avec npTitleIds sont requises"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Récupération des trophées pour des titres spécifiques
    const specificTitlesTrophies = await getUserTrophiesForSpecificTitle(
      authorization,
      accountId,
      options
    );

    res.status(200).json({
      message: "Trophées pour des titres spécifiques récupérés avec succès.",
      data: specificTitlesTrophies
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des trophées pour des titres spécifiques:', error);
    res.status(500).json({
      error: "Erreur lors de la récupération des trophées pour des titres spécifiques",
      details: error.message
    });
  }
});

module.exports = router;