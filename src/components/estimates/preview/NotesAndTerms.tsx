import React from 'react';

interface NotesAndTermsProps {
  notes?: string;
  terms?: string;
}

const NotesAndTerms: React.FC<NotesAndTermsProps> = ({ notes, terms }) => {
  if (!notes && !terms) return null;

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {notes && (
        <div>
          <h4 className="text-sm font-medium text-gray-900">Notes</h4>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
      {terms && (
        <div>
          <h4 className="text-sm font-medium text-gray-900">Terms & Conditions</h4>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">{terms}</p>
        </div>
      )}
    </div>
  );
};

export default NotesAndTerms;