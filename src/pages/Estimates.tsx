import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EstimateList from './estimates/EstimateList';
import NewEstimate from './estimates/NewEstimate';
import ViewEstimate from './estimates/ViewEstimate';
import EditEstimate from './estimates/EditEstimate';

const Estimates: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EstimateList />} />
      <Route path="/new" element={<NewEstimate />} />
      <Route path="/:id" element={<ViewEstimate />} />
      <Route path="/edit/:id" element={<EditEstimate />} />
    </Routes>
  );
};

export default Estimates;