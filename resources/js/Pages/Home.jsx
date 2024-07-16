import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';

function Home({ auth }) {
  return (
    <div>
      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='p-6 text-gray-900 dark:text-gray-100'>
              You're logged in!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Home.layout = (page) => {
  return (
    <AuthenticatedLayout user={page.props.auth.user}>
      <ChatLayout children={page} />
    </AuthenticatedLayout>
  );
};

export default Home;
