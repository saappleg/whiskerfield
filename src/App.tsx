import { useState } from 'react';
import { AuthDialog } from './components/AuthDialog';
import { CommunitySection } from './components/CommunitySection';
import { EditorialSections } from './components/EditorialSections';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MemberShelf } from './components/MemberShelf';
import { useWhiskerfield } from './hooks/use-whiskerfield';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const community = useWhiskerfield();
  const openAuth = () => setAuthOpen(true);

  return <main>
    <Header configured={community.configured} profile={community.profile} signedIn={Boolean(community.user)} onOpenAuth={openAuth} onSignOut={() => void community.signOut()} />
    <Hero onOpenAuth={openAuth} />
    <CommunitySection user={community.user} profile={community.profile} posts={community.posts} feedError={community.feedError} isLoading={community.isLoadingFeed} onRefresh={() => void community.refreshFeed()} onPublish={community.publishPost} onDelete={(id) => void community.deletePost(id)} onOpenAuth={openAuth} />
    <EditorialSections />
    <MemberShelf user={community.user} isMember={community.isMember} resources={community.resources} onJoin={community.joinMemberShelf} onOpenAuth={openAuth} />
    <Footer />
    {authOpen && <AuthDialog configured={community.configured} onClose={() => setAuthOpen(false)} onSendMagicLink={community.sendMagicLink} />}
  </main>;
}
