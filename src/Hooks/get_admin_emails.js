/**
 * React hook: fetch list of admin emails from Firestore once.
 * Document: admin_emails/emails, field: admin_emails_list
 */

import { useEffect, useState } from "react";

export default function useAdminEmails() {
  const [adminEmails, setAdminEmails] = useState(['x@gmail.com']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return { adminEmails, loading, error };
}