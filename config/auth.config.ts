import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import type { NextAuthConfig } from "next-auth";

const authConfig = { providers: [GitHub, GitLab] } satisfies NextAuthConfig;
export default authConfig;
