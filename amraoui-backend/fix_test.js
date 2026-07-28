const fs = require('fs');
const file = 'src/app/modules/requests/requests.service.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /const result = await Requests\.findByIdAndUpdate\(\s*id,\s*\{[\s\S]*?status: 'CUSTOMER_REVIEWING_QUOTE'\s*\},\s*\{\s*new: true\s*\}\s*\)\.populate\(\{ path: 'customerId', select: 'name family_name company email authId' \}\);/,
  `const updated = await Requests.findByIdAndUpdate(
    id,
    {
      'adminQuote.amount': quoteData.amount,
      'adminQuote.driverPrice': quoteData.driverPrice,
      'adminQuote.message': quoteData.message,
      status: 'CUSTOMER_REVIEWING_QUOTE'
    },
    { new: true }
  );
  if (!updated) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  const result = await Requests.findById(id).populate({ path: 'customerId', select: 'name family_name company email authId' }).lean() as any;`
);
fs.writeFileSync(file, code);
