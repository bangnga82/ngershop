import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatVND } from "@/utils/format/vnd";

const ProductListItem = ({ product, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex min-w-0 items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden">
            <img 
              src={product.image[0]} 
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-4 min-w-0 flex-1 overflow-hidden">
            <div
              className="truncate text-[15px] font-medium text-gray-900"
              title={product.name}
            >
              {product.name}
            </div>
            <div
              className="truncate text-sm text-gray-500"
              title={String(product.id)}
            >
              {product.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        <div className="truncate" title={product.category}>
          {product.category}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatVND(product.price)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-start space-x-2">
          <button onClick={() => onView(product)} className="cursor-pointer text-blue-600 hover:text-blue-900" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(product)} className="cursor-pointer text-orange-500 hover:text-orange-700" title="Edit Product">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(product)} className="cursor-pointer text-red-500 hover:text-red-700" title="Delete Product">
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductListItem;
