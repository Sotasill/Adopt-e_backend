import { socialAuth } from '../services/socialAuth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const handleSocialAuth = async (req, res) => {
  const { email, name, providerId, provider, acceptTerms } = req.body;
  const result = await socialAuth({
    email,
    name,
    providerId,
    provider,
    acceptTerms,
  });
  res.json(result);
};

export const social = {
  auth: ctrlWrapper(handleSocialAuth),
};
