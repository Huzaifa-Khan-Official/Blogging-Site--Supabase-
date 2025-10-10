import React, { useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoCamera } from "react-icons/io5";

export function ProfileEditDialog({
  isOpen,
  onClose,
  user,
  selectedImg,
  setSelectedImg,
}) {
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [username, setUsername] = useState(null);
  const [title, setTitle] = useState(null);

  if (!isOpen) return null;

  const handleIconClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfile({ img: selectedImg?.filePath, username, title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 pr-3 sm:pr-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col gap-3 xs:flex-row items-center justify-between">
            <div className="flex flex-wrap justify-center xs:flex-nowrap items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden relative">
                  {selectedImg ? (
                    <img
                      src={selectedImg.url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 "
                    />
                  ) : (
                    <Image
                      src={"/userIcon.jpg"}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                >
                  <Upload
                    type="image"
                    setProgress={setProgress}
                    setData={setSelectedImg}
                  >
                    <IoCamera className="absolute right-0 z-20 -bottom-2 bg-gray-400 p-2 w-10 h-10 rounded-full" />
                  </Upload>
                </label>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyPress}
                    className="font-semibold border border-gray-300 rounded px-2 py-1 w-full"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{username}</h3>
                )}
                <FaRegPenToSquare
                  className="w-4 h-4 mr-2 cursor-pointer"
                  onClick={handleIconClick}
                />
              </div>
            </div>
          </div>
          {progress > 0 && progress < 100 && <p>{`Uploading: ${progress}`}</p>}

          {/* Email Addresses Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Email addresses</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm break-all">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                    Primary
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Title</h4>
            <div className="space-y-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                    }
                  }}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm">{title || "Enter Your Title"}</p>
                  </div>
                  <FaRegPenToSquare
                    className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setIsEditingTitle(true)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connected accounts</h4>
            <button className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaRegPenToSquare className="w-4 h-4 mr-2" />
              Connect account
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 mb-3">
            <div className="flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
              onClick={handleUpdateProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-10" onClick={onClose} />
    </div>
  );
}
