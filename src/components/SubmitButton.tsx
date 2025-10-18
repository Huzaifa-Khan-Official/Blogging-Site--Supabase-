import type React from "react"

interface SubmitButtonProps {
    loading: boolean
    mode?: "create" | "edit"
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, mode = "create" }) => {
    const buttonText = mode === "edit" ? (loading ? "Updating..." : "Update") : loading ? "Publishing..." : "Publish"

    return (
        <button
            type="submit"
            disabled={loading}
            className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
        >
            {buttonText}
        </button>
    )
}

export default SubmitButton