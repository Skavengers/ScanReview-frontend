import React, { useState } from 'react';
import { useGenerateCommunityListMutation } from '../../redux/features/lists/listApiSlice';

const CommunityListButton = ({ subject, category, onSuccess, onError }) => {
  const [generateCommunityList, { isLoading }] = useGenerateCommunityListMutation();
  const [message, setMessage] = useState('');
  const handleGenerate = async () => {
    setMessage('');
    try {
      const result = await generateCommunityList({ subject, category }).unwrap();
      setMessage('Community list generated/updated successfully!');
      if (onSuccess) onSuccess(result);
      // Optionally you can refetch list queries here
    } catch (error) {
      setMessage('Failed to generate community list.');
      if (onError) onError(error);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isLoading}
      className="w-full py-2 bg-blue-700 text-white rounded flex items-center justify-center space-x-2 mt-2"
    >
      {isLoading ? "Generating..." : "🌍 Generate Community List"}
    </button>
  );
};

export default CommunityListButton;
