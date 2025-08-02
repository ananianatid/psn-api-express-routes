const express = require('express');
const router = express.Router();
const { 
  makeUniversalSearch,
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens
} = require('psn-api');

// Recherche universelle makeUniversalSearch
router.post('/search/universal', async (req, res) => {
  try {
    // Les paramètres sont récupérés depuis req.body pour des raisons de sécurité
    const { searchTerm, domain, npsso } = req.body;

    // Validation des paramètres requis
    if (!searchTerm || !domain || !npsso) {
      return res.status(400).json({
        error: "Le terme de recherche, le domaine et le token NPSSO sont requis"
      });
    }

    // Authentification avec PSN
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Effectuer la recherche universelle
    const searchResults = await makeUniversalSearch(
      authorization,
      searchTerm,
      domain
    );

    res.status(200).json({
      message: "Recherche universelle effectuée avec succès.",
      data: searchResults
    });
  } catch (error) {
    console.error('Erreur lors de la recherche universelle:', error);
    res.status(500).json({
      error: "Erreur lors de la recherche universelle",
      details: error.message
    });
  }
});

module.exports = router;