import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { Plus, LogOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Dashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate('/auth');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/auth');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleCreateNew = () => {
    const newId = uuidv4();
    navigate(`/editor/${newId}`);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate('/auth');
    }
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', textShadow: '4px 4px 0 var(--tertiary)' }}>PROJECTS</h1>
        <Button variant="accent" onClick={handleLogout}><LogOut size={20} /> SIGN OUT</Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
        <Panel 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            cursor: 'pointer',
            backgroundColor: 'var(--primary)'
          }}
          onClick={handleCreateNew}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Plus size={48} />
            <h2 style={{ fontSize: '24px' }}>NEW BRUTAL DESIGN</h2>
          </div>
        </Panel>

        {/* Mocking existing projects for UI completion */}
        <Panel style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '20px' }}>Untitled Post</h3>
          <p>Updated 2 hours ago</p>
          <Button variant="secondary" onClick={() => navigate(`/editor/mock-id-1`)}>OPEN</Button>
        </Panel>
      </div>
    </div>
  );
};
