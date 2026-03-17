export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  if (!local) return `***@${domain}`;
  return `${local[0]}***@${domain}`;
}
