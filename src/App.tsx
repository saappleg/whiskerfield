import { Suspense, useState } from 'react';
import { AuthDialog } from './components/AuthDialog';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { useWhiskerfield } from './hooks/use-whiskerfield';
import { lazyWithReload } from './lib/lazy-with-reload';
import { useRouter } from './lib/router';
import { useTheme } from './lib/theme';
import { HomePage } from './pages/HomePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
const MembersPage = lazyWithReload('MembersPage', () => import('./pages/MembersPage').then((module) => ({ default: module.MembersPage })));
const PrivacyPage = lazyWithReload('PrivacyPage', () => import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })));
const StoriesPage = lazyWithReload('StoriesPage', () => import('./pages/StoriesPage').then((module) => ({ default: module.StoriesPage })));

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
      <a className="skip-link" href="#main-content">Skip to main content</a>
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

      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<output className="shell page-loading">Loading Whiskerfield…</output>}>
          {currentRoute === 'home' && (
            <HomePage
              onOpenAuth={openAuth}
              signedIn={Boolean(community.user)}
            />
          )}

          {currentRoute === 'stories' && (
            <StoriesPage user={community.user} userPets={community.userPets} memberStories={community.memberStories} />
          )}

          {currentRoute === 'care' && <DiscoveryPage route="care" />}

          {currentRoute === 'products' && <DiscoveryPage route="products" reviews={community.reviews} user={community.user} onOpenAuth={openAuth} />}

          {currentRoute === 'news' && <DiscoveryPage route="news" />}

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
              reviews={community.reviews}
              memberStories={community.memberStories}
              onPublishReview={community.publishReview}
              onPublishMemberStory={community.publishMemberStory}
              onDeleteReview={community.deleteReview}
              onDeleteMemberStory={community.deleteMemberStory}
              onOpenAuth={openAuth}
              onOpenProfile={openProfile}
            />
          )}

          {currentRoute === 'privacy' && <PrivacyPage />}
        </Suspense>
      </main>

      <Footer />

      {(authOpen || community.passwordRecovery) && (
        <AuthDialog
          configured={community.configured}
          onClose={() => {
            setAuthOpen(false);
            if (community.passwordRecovery) community.dismissPasswordRecovery();
          }}
          onSendMagicLink={community.sendMagicLink}
          onSignInWithPassword={community.signInWithPassword}
          onSignUpWithPassword={community.signUpWithPassword}
          onResetPassword={community.resetPassword}
          passwordRecovery={community.passwordRecovery}
          onUpdatePassword={community.updatePassword}
          onSignInWithPasskey={community.signInWithPasskey}
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
          onRegisterPasskey={community.registerPasskey}
        />
      )}
    </div>
  );
}
