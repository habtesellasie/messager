import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

const ChatLayout = ({ children }) => {
  const page = usePage();
  const conversations = page.props.conversations;
  const selectedConversation = page.props.selectedConversation;

  const [onlineUsers, setOnlineUsers] = useState({});
  const isUserOnline = (userId) => onlineUsers[userId];
  const [localConversations, setLocalConversations] = useState(conversations);
  const [soretedConversations, setSoretedConversations] = useState({});

  useEffect(() => {
    setSoretedConversations(
      localConversations.sort((a, b) => {
        if (a.blocked_at && b.blocked_at) {
          return a.blocked_at > b.blocked_at ? 1 : -1;
        } else if (a.blocked_at) {
          return 1;
        } else if (b.blocked_at) {
          return -1;
        }

        if (a.last_message_date && b.last_message_date) {
          return b.last_message_date.localCompare(a.last_message_date);
        } else if (a.last_message_date) {
          return -1;
        } else if (b.last_message_date) {
          return 1;
        } else {
          return 0;
        }
      })
    );
  }, [localConversations]);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    Echo.join('online')
      .here((users) => {
        const onlineUsersObj = Object.fromEntries(
          users.map((user) => [user.id, user])
        );

        setOnlineUsers((prevOnlineUsers) => {
          return { ...prevOnlineUsers, ...onlineUsersObj };
        });
      })
      .joining((user) => {
        setOnlineUsers((prevOnlineUsers) => {
          const updatedUsers = { ...prevOnlineUsers };
          updatedUsers[user.id] = user;
          return updatedUsers;
        });
      })
      .leaving((user) => {
        setOnlineUsers((prevOnlineUsers) => {
          const updatedUsers = { ...prevOnlineUsers };
          delete updatedUsers[user.id];
          return updatedUsers;
        });
      })
      .error((error) => {
        console.log('error', error);
      });

    return () => {
      Echo.leave('online');
    };
  }, []);

  return <div>{children}</div>;
};

export default ChatLayout;
