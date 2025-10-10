import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface DescriptionTextareaProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

const DescriptionTextarea: React.FC<DescriptionTextareaProps> = ({ register, errors }) => {
    return (
        <>
            <textarea
                {...register("desc", {
                    required: {
                        value: true,
                        message: "Description is required",
                    }
                })}
                placeholder="A short Description"
                className="p-4 rounded-xl bg-white shadow-md"
                rows={4}
            />
            {errors.desc && errors.desc?.message && (
                <p className="text-red-500">{String(errors.desc.message)}</p>
            )}
        </>
    );
};

export default DescriptionTextarea;