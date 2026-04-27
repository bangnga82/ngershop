import React from "react";

const CategoryForm = ({
	formData,
	onChange,
	onSubmit,
	formType,
	onClose,
}) => {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Category Name
				</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={onChange}
					className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={onChange}
					rows="3"
					className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
				></textarea>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Image
				</label>
				<label className="mt-1 flex items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 cursor-pointer transition hover:border-[color:var(--accent-border)] hover:bg-[color:var(--accent-soft)] focus-within:ring-2 focus-within:ring-[color:var(--accent)]">
					<span className="truncate">
						{formData.image?.name || "Choose an image file"}
					</span>
					<span className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
						Browse
					</span>
					<input
						type="file"
						name="image"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							const file = e.target.files?.[0] || null;
							onChange({
								target: {
									name: "image",
									value: file,
								},
							});
						}}
					/>
				</label>
				<p className="mt-1 text-xs text-gray-500">
					Upload an image for this category.
				</p>
			</div>

			<div className="flex justify-end space-x-3 pt-4">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
				>
					{formType === "add" ? "Add Category" : "Save Changes"}
				</button>
			</div>
		</form>
	);
};

export default CategoryForm;
