import React from 'react';

interface SubmitButtonProps {
    loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
        >
            {loading ? "Publishing..." : "Publish"}
        </button>
    );
};

export default SubmitButton;