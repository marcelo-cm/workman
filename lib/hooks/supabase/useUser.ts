import { createClient as createSupabaseClient } from "@/utils/supabase/client";

export const useUser = () => {
  const supabase = createSupabaseClient();

  const updateUser = async (column_value: { [column: string]: string }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("Failed to get user");
    }

    const userId = userData?.user?.id;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(column_value)
      .eq("user_id", userId);

    if (error) {
      throw new Error("Failed to update user");
    }

    return data;
  };

  return {
    updateUser,
  };
};
