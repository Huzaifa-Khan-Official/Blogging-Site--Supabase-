import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TitleInputProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

const TitleInput: React.FC<TitleInputProps> = ({ register, errors }) => {
    return (
        <>
            <input
                type="text"
                placeholder="My Awesome Story"
                className="text-4xl font-semibold bg-transparent outline-none"
                {...register("title", {
                    required: {
                        value: true,
                        message: "Title is required",
                    },
                })}
            />
            {errors.title && errors.title?.message && (
                <p className="text-red-500">{String(errors.title.message)}</p>
            )}
        </>
    );
};

export default TitleInput;