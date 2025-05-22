// components/nexus-assistant-answer.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function NexusAssistantAnswer() {
  const dummyAnswer = `
  Structuring a clean and maintainable **ASP.NET Core Web API** project is essential for scalability and ease of collaboration. Here are some best practices:

  1. **Layered Architecture**:
     - Organize into layers: _Controllers_, _Services_, _Repositories_, and _Models_.
     - Example folder structure:
       \`\`\`
       /Controllers
       /Services
       /Repositories
       /Models
       /DTOs
       /Configurations
       /Middlewares
       \`\`\`

  2. **Dependency Injection (DI)**:
     - Register all services and repositories in \`Startup.cs\` or \`Program.cs\`.
     - Avoid using static classes for business logic.

  3. **Use DTOs**:
     - Create separate DTOs for input/output to avoid leaking internal models.

  4. **Error Handling Middleware**:
     - Implement global exception handling using middleware to return consistent error responses.

  5. **Validation**:
     - Use FluentValidation or DataAnnotations to validate request models.

  6. **Entity Framework Core Best Practices**:
     - Use async/await for DB operations.
     - Keep DbContext lifetime scoped.
     - Avoid lazy loading unless necessary.

  7. **Configuration and Secrets**:
     - Use \`appsettings.json\` and environment variables.
     - Never hardcode secrets—use Secret Manager or Azure Key Vault.

  8. **Logging and Monitoring**:
     - Integrate with Serilog or NLog.
     - Use Application Insights or other tools for performance monitoring.

  9. **Unit Testing**:
     - Use xUnit, Moq, and test the service layer independently.

  10. **API Versioning and Documentation**:
      - Implement versioning using URL or header.
      - Use Swagger/OpenAPI for documentation and testing.

  Following these principles will help ensure your Web API is clean, testable, and ready for long-term maintenance.
  `

  return (
    <Card className="border-blue-500 border-2">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="text-blue-500" />
        <CardTitle className="text-lg text-blue-700">Nexus Assistant Suggested Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: dummyAnswer.replace(/\n/g, "<br/>") }} />
      </CardContent>
    </Card>
  )
}
