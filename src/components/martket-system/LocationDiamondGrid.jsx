import React from "react";
import { motion } from "framer-motion";
import "./LocationDiamondGrid.scss";

const LocationDiamondGrid = ({ locations = [] }) => {
    if (!locations?.length) {
        return (
            <div className="py-10 text-center text-sm text-gray-500">
                Không có cửa hàng phù hợp.
            </div>
        );
    }

    return (
        <div className="ms-cardGrid" role="list">
            {locations.map((location, index) => (
                <motion.div
                    key={`${location?.title ?? "loc"}-${index}`}
                    role="listitem"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.25) }}
                    className="ms-card"
                >
                    <h3 className="ms-card__title">{location?.title}</h3>

                    <div className="ms-card__row">
                        <span className="ms-card__label">Địa chỉ:</span>
                        <span className="ms-card__value ms-card__value--address">
                            {location?.address}
                        </span>
                    </div>

                    <div className="ms-card__row">
                        <span className="ms-card__label">Hotline:</span>
                        <span className="ms-card__value">{location?.hotline}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LocationDiamondGrid;
