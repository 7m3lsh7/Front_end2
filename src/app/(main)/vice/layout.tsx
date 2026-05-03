import RoleGuard from "@/components/auth/RoleGuard";

export default function ViceLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={["StudentAffairs", "Admin"]} fallbackRoute="/login">
            {children}
        </RoleGuard>
    );
}
