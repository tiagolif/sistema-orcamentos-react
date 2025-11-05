import React from 'react';

const BasesDePrecoList = ({ bases }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">ID</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Nome da Base</th>
          </tr>
        </thead>
        <tbody>
          {bases.map(base => (
            <tr key={base.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
              <td className="py-3 px-4 text-sm font-normal text-gray-800">{base.id}</td>
              <td className="py-3 px-4 text-sm font-normal text-gray-800">{base.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BasesDePrecoList;
