import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CategorySelectProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ register, errors }) => {
    return (
        <>
            <div className="flex items-center gap-4">
                <label htmlFor="category" className="text-sm">
                    Choose a category:
                </label>
                <select
                    {...register("category", {
                        required: {
                            value: true,
                            message: "Category is required",
                        }
                    })}
                    className="p-2 rounded-xl bg-white shadow-md"
                >
                    <option value="general">General</option>
                    <option value="web-design">Web Design</option>
                    <option value="development">Development</option>
                    <option value="databases">Databases</option>
                    <option value="seo">Search Engines</option>
                    <option value="marketing">Marketing</option>
                </select>
            </div>
            {errors.category && errors.category?.message && (
                <p className="text-red-500">{String(errors.category.message)}</p>
            )}
        </>
    );
};

export default CategorySelect;