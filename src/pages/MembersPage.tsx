import type { User } from '@supabase/supabase-js';
import { MemberShelf } from '../components/MemberShelf';
import type { MemberResource } from '../types/community';

type MembersPageProps = {
  user: User | null;
  isMember: boolean;
  resources: MemberResource[];
  onJoin: () => Promise<string | null>;
  onOpenAuth: () => void;
};

export function MembersPage({ user, isMember, resources, onJoin, onOpenAuth }: MembersPageProps) {
  return (
    <div className="members-page" style={{ paddingBottom: '96px' }}>
      <MemberShelf
        user={user}
        isMember={isMember}
        resources={resources}
        onJoin={onJoin}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
}
