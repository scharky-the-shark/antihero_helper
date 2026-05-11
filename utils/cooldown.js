const cooldowns = new Map();

function checkCooldown(key, hours) {
  const now = Date.now();
  const cooldownMs = hours * 60 * 60 * 1000;
  const last = cooldowns.get(key) || 0;

  const remaining = cooldownMs - (now - last);
  if (remaining <= 0) return 0;

  return Math.ceil(remaining / (1000 * 60 * 60));
}

function setCooldown(key) {
  cooldowns.set(key, Date.now());
}

module.exports = { checkCooldown, setCooldown };
