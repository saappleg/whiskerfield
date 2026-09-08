const VISITOR_KEY = 'wf_visitor_id';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'v_server';

  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = 'v_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}
