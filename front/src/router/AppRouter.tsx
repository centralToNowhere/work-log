import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorksPage } from '@/pages';

const AppRouter = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorksPage />} />
      </Routes>
    </Router>
  );
});

export default AppRouter;
