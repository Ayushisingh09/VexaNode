const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "app/api/verify-payment/route.ts",
  "app/api/user/data/route.ts",
  "app/api/tickets/route.ts",
  "app/api/tickets/[id]/route.ts",
  "app/api/orders/create/route.ts",
  "app/api/tickets/[id]/reply/route.ts",
  "app/api/admin/data/route.ts",
  "app/api/admin/create-server/route.ts",
  "app/api/admin/action/route.ts"
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace getServerSession() with getServerSession(authOptions)
  content = content.replace(/getServerSession\(\)/g, "getServerSession(authOptions)");
  
  // Add import authOptions
  if (!content.includes('authOptions')) {
    content = content.replace(
      'import { getServerSession } from "next-auth"', 
      'import { getServerSession } from "next-auth"\nimport { authOptions } from "@/app/api/auth/[...nextauth]/route"'
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
}
