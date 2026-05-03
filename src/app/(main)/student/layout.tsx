import RoleGuard from "@/components/auth/RoleGuard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={["Student", "Admin"]} fallbackRoute="/login">
            {children}
        </RoleGuard>
    );
}
