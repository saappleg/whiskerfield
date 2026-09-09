import { useState } from 'react';
import { AuthDialog } from './components/AuthDialog';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { useWhiskerfield } from './hooks/use-whiskerfield';
import { useRouter } from './lib/router';
import { useTheme } from './lib/theme';
import { HomePage } from './pages/HomePage';
import { MembersPage } from './pages/MembersPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { StoriesPage } from './pages/StoriesPage';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const community = useWhiskerfield();
  const { currentRoute } = useRouter();
  const { theme, toggleTheme } = useTheme();

  const openAuth = () => setAuthOpen(true);
  const openProfile = () => setProfileModalOpen(true);

  return (
    <div className="app-shell">
      <Header
        configured={community.configured}
        profile={community.profile}
        signedIn={Boolean(community.user)}
        currentRoute={currentRoute}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={openAuth}
        onOpenProfile={openProfile}
        onSignOut={() => void community.signOut()}
      />

      <main>
        {currentRoute === 'home' && (
          <HomePage
            onOpenAuth={openAuth}
            signedIn={Boolean(community.user)}
          />
        )}

        {currentRoute === 'stories' && (
          <StoriesPage user={community.user} userPets={community.userPets} />
        )}

        {currentRoute === 'members' && (
          <MembersPage
            user={community.user}
            profile={community.profile}
            userPets={community.userPets}
            posts={community.posts}
            comments={community.comments}
            feedError={community.feedError}
            isLoading={community.isLoadingFeed}
            onRefresh={() => void community.refreshFeed()}
            onPublish={community.publishPost}
            onDelete={(id) => void community.deletePost(id)}
            onReactPost={community.reactToPost}
            onReactComment={community.reactToComment}
            onAddComment={community.publishComment}
            onOpenAuth={openAuth}
            onOpenProfile={openProfile}
          />
        )}

        {currentRoute === 'privacy' && <PrivacyPage />}
      </main>

      <Footer />

      {authOpen && (
        <AuthDialog
          configured={community.configured}
          onClose={() => setAuthOpen(false)}
          onSendMagicLink={community.sendMagicLink}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          profile={community.profile}
          pets={community.userPets}
          onClose={() => setProfileModalOpen(false)}
          onUpdateProfile={community.updateProfile}
          onCreatePet={community.createPet}
          onUpdatePet={community.updatePet}
          onDeletePet={community.deletePet}
        />
      )}
    </div>
  );
}
