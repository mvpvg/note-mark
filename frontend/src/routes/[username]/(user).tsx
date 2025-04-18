import { A, useNavigate, useParams } from "@solidjs/router";
import RecentNotes from "../../components/recent_notes";
import UserSearchModal from "../../components/modals/user_search";
import { useModal } from "../../contexts/ModalProvider";
import { useCurrentUser } from "../../contexts/CurrentUserProvider";
import { Show } from "solid-js";
import Icon from "../../components/icon";
import NewBookModal from "../../components/modals/new_book";
import { Book } from "../../core/types";
import { useDrawer } from "../../contexts/DrawerProvider";
import { useApi } from "../../contexts/ApiProvider";

const User = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { apiDetails, setApiDetails } = useApi()
  const { setModal, clearModal } = useModal()
  const { user } = useCurrentUser()
  const drawer = useDrawer()

  const openUserSearchModal = () => {
    setModal({
      component: UserSearchModal,
      props: {
        onClose: () => clearModal(),
      },
    })
  }

  const onNewBookClick = () => {
    setModal({
      component: NewBookModal,
      props: {
        onClose: (newBook?: Book) => {
          if (newBook) drawer.updateBook(newBook)
          clearModal()
        }, user: user()
      },
    })
  }

  return (
    <div class="bg-base-200 py-6 flex flex-col gap-4">
      <h1 class="text-4xl font-bold text-center">{drawer.currentUser()?.name || params.username}'s Area</h1>
      <div class="max-w-md mx-auto text-center">
        <div class="join">
          <Show
            when={user() !== undefined} fallback={
              <Show when={apiDetails().authToken} fallback={
                <A
                  class="join-item btn btn-outline"
                  href="/login"
                >Login</A>
              }>
                <button
                  class="join-item btn btn-outline" onclick={() => {
                    setApiDetails({ authToken: undefined })
                    navigate("/login")
                  }}>Re-Login</button>
              </Show>
            }>
            <Show when={user()?.username === params.username} fallback={
              <A
                class="btn join-item btn-outline"
                href={`/${user()?.username}`}
              >My Notes</A>
            }>
              <button
                onClick={onNewBookClick}
                class="btn join-item btn-outline"
                type="button"
              >
                <Icon name="folder-plus" />
                New Book
              </button>
            </Show>
          </Show>
          <button
            onclick={() => openUserSearchModal()}
            class="btn join-item btn-outline"
            type="button"
          >
            <Icon name="users" />
            Find User
          </button>
        </div>
      </div>
      <div class="mx-4 p-2 bg-base-100 rounded">
        <h2 class="text-lg font-bold text-center">Recent Notes</h2>
        <RecentNotes />
      </div>
    </div>
  )
}

export default User;
