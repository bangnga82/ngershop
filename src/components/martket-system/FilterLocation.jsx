import React from "react";
import { locationData } from "./dataLocation";

const FilterLocation = ({
	selectedDistrict,
    selectedProvince,
    setSelectedDistrict,
	setSelectedProvince,
    districts,
    locationsCount = 0,
}) => {
    return (
        <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent-border)] p-4 rounded-2xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <select
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        className="min-w-[220px] w-full px-4 py-3 rounded-xl border-none bg-[color:var(--accent)] text-white cursor-pointer outline-none"
                    >
                        <option className="bg-[#ffffff] text-black" value="">
                            Chọn tỉnh thành
                        </option>
                        {Object.entries(locationData).map(([key, province]) => (
                            <option
                                className="bg-[#ffffff] text-black"
                                key={key}
                                value={key}
                            >
                                {province.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedDistrict}
                        onChange={setSelectedDistrict}
                        disabled={!selectedProvince}
                        className="min-w-[220px] w-full px-4 py-3 rounded-xl bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                            <option key={district.value} value={district.value}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-sm text-gray-600 lg:ml-auto">
                    {locationsCount} cửa hàng
                </div>
            </div>
        </div>
	);
};

export default FilterLocation;
